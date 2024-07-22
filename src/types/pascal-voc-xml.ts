export type OBJECT = {
  name: string
  pose: string
  truncated: number
  difficult: number
  bndbox: {
    xmin: number
    ymin: number
    xmax: number
    ymax: number
  }
}
export type PASCAL_VOC_XML = {
  annotation: {
    folder: string
    filename: string
    path: string
    source: {
      database: string
    }
    size: {
      width: number
      height: number
      depth: number
    }
    segmented: number
    objects: OBJECT[]
  }
}