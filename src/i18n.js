
module.exports = ({ lang = 'en', locales }) => {
  const resources = locales[lang]
  if (!resources) {
    throw new Error(`Resources for language (${lang}) not found`)
  }
  return {
    translate (key, interpolation) {
      const message = resources[key]
      if (!message) {
        throw new Error(`Resources (${lang}) with key ${key} not found`)
      }
      const regex = /\{\{(.*?)}}/gm
      return message.replaceAll(regex, (_, keyName) => {
        return interpolation[keyName] ?? keyName
      })
    }
  }
}
