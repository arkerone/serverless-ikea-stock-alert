const checker = require('ikea-availability-checker')
const AWS = require('aws-sdk')
const i18n = require('./i18n')
const locales = require('./locales')

module.exports.checkStock = async function (event) {
  const topicArn = process.env.TOPIC_ARN
  if (!topicArn) {
    throw new Error('Missing topic arn')
  }

  const lang = process.env.LANGUAGE

  const { translate } = i18n({
    lang,
    locales
  })
  const promiseErrors = []

  const sns = new AWS.SNS()

  const { storeId, city, products } = event

  const stockPromises = products.map(async (product) =>
    checker.availability(storeId, product.id)
  )
  const productStocks = await Promise.allSettled(stockPromises)

  const publishPromises = []
  for (let i = 0; i < productStocks.length; i++) {
    const { status, value, reason } = productStocks[i]

    if (status === 'fulfilled') {
      if (value.stock > 0) {
        const currentProduct = products[i]
        const params = {
          Message: translate('message', {
            productName: currentProduct.name,
            stock: value.stock,
            city
          }),
          Subject: translate('subject', {
            productName: currentProduct.name,
            city
          }),
          TopicArn: topicArn
        }
        publishPromises.push(sns.publish(params).promise())
      }
    } else {
      promiseErrors.push(reason)
    }
  }

  const publishes = await Promise.allSettled(publishPromises)
  for (const { status, reason } of publishes) {
    if (status === 'rejected') {
      promiseErrors.push(reason)
    }
  }

  if (promiseErrors.length > 0) {
    console.error(promiseErrors)
  }
}
