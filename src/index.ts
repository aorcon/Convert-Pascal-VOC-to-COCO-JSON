import fs from 'fs'
import { COCO_JSON } from './types/coco-types'
import { readXml } from './read-xml'
import { DateTime } from 'luxon'
import Debug from 'debug'
import { PASCAL_VOC_XML } from 'pascal-voc-xml'

const debug = Debug('main')

const pascal_voc_path = 'annotations'
const coco_json_train_path = 'coco/annotations/instances_train2014.json'
const coco_json_val_path = 'coco/annotations/instances_val2014.json'
const percent = 0.8

const train: COCO_JSON = {
  info: {
    year: "2024",
    version: "1",
    description: "Transfer by Aorcon@github",
    contributor: "Aorcon",
    url: "https://www.google.com",
    date_created: "2000-01-01T00:00:00+00:00"
  },
  licenses: [],
  categories: [],
  images: [],
  annotations: []
}

const val: COCO_JSON = {
  info: {
    year: "2024",
    version: "1",
    description: "Transfer by Aorcon@github",
    contributor: "Aorcon",
    url: "https://www.google.com",
    date_created: "2000-01-01T00:00:00+00:00"
  },
  licenses: [],
  categories: [],
  images: [],
  annotations: []
}

const now = DateTime.now()
train.info.year = now.year.toString()
train.info.date_created = now.toISO()
val.info.year = now.year.toString()
val.info.date_created = now.toISO()

const files = fs.readdirSync(pascal_voc_path)
const list: PASCAL_VOC_XML[] = []
for (const file of files) {
  if (file.endsWith('.xml')) {
    debug('file', file)
    const content = fs.readFileSync(`${pascal_voc_path}/${file}`, 'utf-8')
    const xml = readXml(content)
    list.push(xml)
  }
}

const names = [] as string[]

list.forEach((xml) => {
  if (xml && xml.annotation && xml.annotation.objects) {
    for (const object of xml.annotation.objects) {
      const name = object.name
      if (!names.includes(name)) {
        names.push(name)
        train.categories.push({
          id: train.categories.length + 1,
          name: name,
          supercategory: ''
        })
      }
    }
  }
  val.categories = train.categories
})
list.forEach((xml) => {
  const root: COCO_JSON = Math.random() < percent ? train : val
  if (xml && xml.annotation && xml.annotation.filename) {
    const image_id = root.images.length + 1
    root.images.push({
      id: image_id,
      width: xml.annotation.size.width,
      height: xml.annotation.size.height,
      file_name: xml.annotation.filename,
      date_captured: root.info.date_created
    })
    if (xml.annotation.objects) {
      for (const object of xml.annotation.objects) {
        const name = object.name
        const category_id = root.categories.find(category => category.name === name)?.id
        if (category_id) {
          const width = object.bndbox.xmax - object.bndbox.xmin
          const height = object.bndbox.ymax - object.bndbox.ymin
          root.annotations.push({
            id: root.annotations.length + 1,
            image_id: image_id,
            category_id: category_id,
            segmentation: [],
            area: width * height,
            bbox: [
              object.bndbox.xmin,
              object.bndbox.ymin,
              object.bndbox.xmax - object.bndbox.xmin,
              object.bndbox.ymax - object.bndbox.ymin
            ]
          })
        } else {
          debug('category_id not found', name)
        }
      }
    }
  }
})

// debug('root', JSON.stringify(root, null, 2))
fs.writeFileSync(coco_json_train_path, JSON.stringify(train, null, 2))
fs.writeFileSync(coco_json_val_path, JSON.stringify(val, null, 2))