let styleKey = {
  "backgroundImage": "url(%s)"
}

export function createStyles(data) {
    let styles = {}
    if(data.style) {
      for(let key in data.style.value){
        let val = data.style.value[key].value
        if(!val) continue;
        if(key in styleKey) {
          val = styleKey[key].replace("%s", val)
        }
        styles[key] = val
      }
    }
    return styles
  }

export default {
  createStyles
}
