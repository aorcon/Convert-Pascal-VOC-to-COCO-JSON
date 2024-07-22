import sax from 'sax'
import Debug from 'debug'
import { PASCAL_VOC_XML, OBJECT } from 'pascal-voc-xml'

const debug = Debug('read-xml')

export function readXml(xml: string): any {
  const parser = sax.parser(true, { trim: true })
  const result = initVOC() as PASCAL_VOC_XML
  const stack: (sax.Tag | sax.QualifiedTag)[] = []
  let current: string = ''
  let parent: string = ''
  let object: OBJECT = null
  parser.onopentag = (node) => {
    stack.push(node)
    current = node.name
    parent = stack.length > 1 ? stack[stack.length - 2].name : ''
    if (current === 'object') {
      object = initOBJECT()
      result.annotation.objects.push(object)
    }
    // const newNode = { ...node }
    // if (current) {
    //   if (!current[node.name]) {
    //     current[node.name] = newNode
    //   } else if (Array.isArray(current[node.name])) {
    //     current[node.name].push(newNode)
    //   } else {
    //     current[node.name] = [current[node.name], newNode]
    //   }
    //   stack.push(current)
    //   current = newNode
    // } else {
    //   current = newNode
    //   result = current
    // }
  }

  parser.onclosetag = () => {
    stack.pop()
    if (current === 'object') {
      object = null
    }
  }

  parser.ontext = (text) => {
    if (current === 'folder') {
      result.annotation.folder = text
    } else if (current === 'filename') {
      result.annotation.filename = text
    } else if (current === 'path') {
      result.annotation.path = text
    } else if (current === 'database' && parent === 'source') {
      result.annotation.source.database = text
    } else if (current === 'width' && parent === 'size') {
      result.annotation.size.width = parseInt(text)
    } else if (current === 'height' && parent === 'size') {
      result.annotation.size.height = parseInt(text)
    } else if (current === 'depth' && parent === 'size') {
      result.annotation.size.depth = parseInt(text)
    } else if (current === 'segmented') {
      result.annotation.segmented = parseInt(text)
    } else if (parent === 'object') {
      if (current === 'name') {
        object.name = text
      } else if (current === 'pose') {
        object.pose = text
      } else if (current === 'truncated') {
        object.truncated = parseInt(text)
      } else if (current === 'difficult') {
        object.difficult = parseInt(text)
      }
    } else if (parent === 'bndbox') {
      if (current === 'xmin') {
        object.bndbox.xmin = parseInt(text)
      } else if (current === 'ymin') {
        object.bndbox.ymin = parseInt(text)
      } else if (current === 'xmax') {
        object.bndbox.xmax = parseInt(text)
      } else if (current === 'ymax') {
        object.bndbox.ymax = parseInt(text)
      }
    }
  }

  parser.write(xml).close()

  return result
}

const initVOC = () => {
  return {
    annotation: {
      folder: '',
      filename: '',
      path: '',
      source: {
        database: ''
      },
      size: {
        width: 0,
        height: 0,
        depth: 0,
      },
      segmented: 0,
      objects: [] as OBJECT[]
    }
  }
}

const initOBJECT = () => {
  return {
    name: '',
    pose: '',
    truncated: 0,
    difficult: 0,
    bndbox: {
      xmin: 0,
      ymin: 0,
      xmax: 0,
      ymax: 0
    }
  }
}

// const path = 'annotations/0a2deacc6de3ee1294ee1de20fc177a2_001.xml'

// const content = fs.readFileSync(path, 'utf-8')
// const xml = readXml(content)
// console.log(JSON.stringify(xml, null, 2))

