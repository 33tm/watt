const functions = require('firebase-functions')
const admin = require('../helpers/adminInit')
const firestore = admin.firestore()

const apiBase = 'https://api.schoology.com/v1'
const oauth = require('../helpers/sgyOAuth')
const periods = ['1', '2', '3', '4', '5', '6', '7', 'SELF']

const pausdZoomRegex = /pausd.zoom.us\/[js]\/(\d+)(\?pwd=\w+)?/i
const maybeLinkRegex = /Zoom|Meeting|Link/i
const classLinkRegex = /Period.+?\d|Class|SELF/i
const officeHoursLinkRegex = /Office.*?Hours?|Tutorial/i

function toJson ([data]) {return JSON.parse(data)}


const getSgyInfo = async (uid) => {
    const creds = (await firestore.collection('users').doc(uid).get()).data()
    if (creds) {
        return {uid: creds.sgy.uid, key: creds.sgy.key, sec: creds.sgy.sec, classes: creds.classes}
    }
    else {
        return null
    }
}

const getClassInfo = (info) => {
    const words = info.split(' ')
    return {pName: words[0], pTeacher: words[1]}
}

const getPAUSDZoomLink = (link) => {
    const matches = link.match(pausdZoomRegex)
    if (matches[2]) {
        return 'https://pausd.zoom.us/j/' + matches[1] + matches[2]
    } else {
        return 'https://pausd.zoom.us/j/' + matches[1]
    }
}

const getLinks = async (classID, classPeriod, accessToken) => {
    let classLink = null
    let officeHoursLink = null
    let classLinkName = null
    let officeHoursLinkName = null

    const docs = await oauth.get(`${apiBase}/sections/${classID}/documents/?start=0&limit=1000`, accessToken.key, accessToken.sec)
        .then(toJson)
        .catch(e => console.log(e))
        .then(dList => {
            return dList['document']
        })

    let certain = false
    for (const element of docs) {
        if (classLink && officeHoursLink && certain) break
        if (element['attachments'].links) {
            let link = element['attachments'].links.link[0].url
            let title = element['attachments'].links.link[0].title
            if (link && link.match(pausdZoomRegex)) {
                if (title.match(classLinkRegex)) {
                    if (classLinkRegex) {
                        if (title.match(classPeriod)) {
                            certain = true
                            classLink = getPAUSDZoomLink(link)
                            classLinkName = title
                        } else if (title.match(officeHoursLinkRegex)) {
                            officeHoursLink = getPAUSDZoomLink(link)
                            officeHoursLinkName = title
                        }
                    } else {
                        classLink = getPAUSDZoomLink(link)
                        classLinkName = title
                    }

                }
                else if (title.match(officeHoursLinkRegex)) {
                    officeHoursLink = getPAUSDZoomLink(link)
                    officeHoursLinkName = title
                }
                else if (title.match(maybeLinkRegex) && !classLink) {
                    classLink = getPAUSDZoomLink(link)
                    classLinkName = title
                }
            }
        }

    }

    if (!classLink || !officeHoursLink) {
        const pages = await oauth.get(`${apiBase}/sections/${classID}/pages/?start=0&limit=1000`, accessToken.key, accessToken.sec)
            .then(toJson)
            .catch(e => console.log(e))
            .then(pList => {
                return pList['page']
            })

        let certain = false
        for (const element of pages) {
            if (classLink && officeHoursLink && certain) break
            if (element.body && element.title) {
                let body = element.body
                let title = element.title
                if (body && body.match(pausdZoomRegex)) {
                    if (title.match(classLinkRegex)) {
                        if (classLinkRegex) {
                            if (title.match(classPeriod)) {
                                certain = true
                                classLink = getPAUSDZoomLink(body)
                                classLinkName = title
                            } else if (title.match(officeHoursLinkRegex)) {
                                officeHoursLink = getPAUSDZoomLink(body)
                                officeHoursLinkName = title
                            }
                        } else {
                            classLink = getPAUSDZoomLink(body)
                            classLinkName = title
                        }

                    }
                    else if (title.match(officeHoursLinkRegex)) {
                        officeHoursLink = getPAUSDZoomLink(body)
                        officeHoursLinkName = title
                    }
                    else if (title.match(maybeLinkRegex) && !classLink) {
                        classLink = getPAUSDZoomLink(body)
                        classLinkName = title
                    }
                }
            }

        }
    }

    return {l: classLink, o: officeHoursLink, ln: classLinkName, on: officeHoursLinkName}
}


const init = async (data, context) => {
    const uid = context.auth.uid
    if (!uid) throw new functions.https.HttpsError('unauthenticated', 'Error: user not signed in.')

    const sgyInfo = await getSgyInfo(uid)

    const sgyClasses = await oauth.get(`${apiBase}/users/${sgyInfo.uid}/sections`, sgyInfo.key, sgyInfo.sec)
        .then(toJson)
        .catch(e => console.log(e))
        .then(cList => {
            return cList['section']
        })

    const classes = {}
    const teachers = {}
    for (const element of sgyClasses) {
        let {pName, pTeacher} = getClassInfo(element['section_title'])
        if (periods.indexOf(pName) > -1) {
            if (pName === 'SELF') pName = 'S'
            classes[pName] = {
                n: element['course_title'],
                c: sgyInfo.classes[pName]["c"],
                l: '',
                o: '',
                s: element.id,
            }

            let periodLinks = await getLinks(element.id, pName, sgyInfo)
            if (periodLinks.l) {
                classes[pName].l = periodLinks.l
            }
            if (periodLinks.o) {
                classes[pName].o = periodLinks.o
            }

            teachers[element['course_title']] = [pTeacher, periodLinks.ln, periodLinks.on]
        }
    }

    firestore.collection('users').doc(uid).update({classes: classes}).catch(e => console.log(e))

    return teachers
}

const upcoming = async (data, context) => {
    const uid = context.auth.uid
    if (!uid) throw new functions.https.HttpsError('unauthenticated', 'Error: user not signed in.')

    const sgyInfo = await getSgyInfo(uid)

    if (!sgyInfo) throw new functions.https.HttpsError('unauthenticated', 'Error: user not signed in.')

    const currentDate = new Date(Date.now())
    const startDate = `${currentDate.getFullYear()}${currentDate.getMonth()+1}${currentDate.getDate()}`

    const events = await oauth.get(`${apiBase}/users/${sgyInfo.uid}/events?start_date=${startDate}`, sgyInfo.key, sgyInfo.sec)
        .then(toJson)
        .catch(e => console.log(e))

    return true
}

exports.init = functions.https.onCall(init)
exports.upcoming = functions.https.onCall(upcoming)
