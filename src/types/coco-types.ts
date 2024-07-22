export type COCO_JSON = {
  info: {
    year: string
    version: string
    description: string
    contributor: string
    url: string
    date_created: string
  }
  licenses: {
    id: number
    url: string
    name: string
  }[]
  categories: {
    id: number
    name: string
    supercategory: string
  }[]
  images: {
    id: number
    width: number
    height: number
    file_name: string
    date_captured: string
    license?: number
    coco_url?: string
    flickr_url?: string
  }[]
  annotations: {
    id?: number
    image_id: number
    category_id: number
    iscrowd?: number
    segmentation?: number[]
    area?: number
    bbox: number[] // left, top, width, height
  }[]
  videos?: {
    id: number
    width: number
    height: number
    file_name: string
    license: number
    date_captured: string
  }[]
  segments?: {
    id: number
    video_id: number
    category_id: number
    start_time: number
    end_time: number
    track_id: number
    segmentation: number[]
    area: number
    bbox: number[]
    iscrowd: number
  }[]
}