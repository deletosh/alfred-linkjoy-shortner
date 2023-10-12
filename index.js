import alfy from 'alfy'
import validUrl from 'is-valid-http-url'

const LINKJOY_API_URL = "https://api.linkjoy.io/api/url-shortener/project"
const apiKey = process.env.API_TOKEN
const workspaceId = process.env.WORKSPACE_ID
const customDomainId = process.env.CUSTOM_DOMAIN_ID

//validate
// 0 - url (required), 1 - slug, 2 - is deeplink, 3 - tagname
const inputQuery = alfy.input.split('*')
const validate = (userInput) => {
    return (userInput[0] !== '' && validUrl(userInput[0]))
}
const getParams = (userInput) => {
    const longURL = userInput[0]
    const slug = String(userInput[1]) || false // custom slug name
    const isDeepLink = Boolean(userInput[2]) || false // is it a deeplink
    const tagName = userInput[3] || ""

    return {
        "long_url": longURL,
        "slug": slug,
        "tag_name": tagName,
        "receiver_contact_id": null,
        "is_deep_link": isDeepLink,
        "custom_domain_id": customDomainId
    }
}

// if (validate(inputQuery)) {
const {data} = await alfy.fetch(`${LINKJOY_API_URL}`, {
    headers: {
        Authorization: `Bearer ${apiKey}`, Workspace: `${workspaceId}`
    }, method: 'POST', json: {
        "project": getParams(inputQuery)
    }
})
const shortUrl = `https://${data.customdomain.domain_name}/${data.actual_url_slug}`
const items = [{
    uid: data.id, title: shortUrl, subtitle: data.slug, arg: shortUrl
}]
// alfy.log(data)
alfy.output(items)
