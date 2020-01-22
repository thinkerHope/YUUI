import React from 'react'
import Notification from 'rc-notification'

let defaultDuration = 3
let defaultTop
let maxCount

let getContainer = () => {}
let messageInstance = null
let key = 1
 
const isArgsProps = content => {
    return typeof content ==='object' && !!(content).content
}

function getMessageInstance(callback) {
    if (messageInstance) {
        callback(messageInstance)
        return
    }
    Notification.newInstance({
        style: { top: defaultTop },
        maxCount,
        getContainer,
    }, 
    instance => {
        if (messageInstance) {
            callback(messageInstance)
            return
        }
        messageInstance = instance
        callback(instance)
    })
} 

function notice(args = {}) {
    const { content, onClose } = args
    const duration = args.duration ? args.duration : defaultDuration
    const target = args.key || key++

    const callback = () => {
        if (typeof onClose === 'function') {
            onClose()
        }
    }

    getMessageInstance(instance => {
        instance.notice({
            content: (
                <div className='custom-content'>
                    <span>{content}</span>
                </div>
            ),
            // 必须保证每个notice都有唯一的key
            key: target,
            duration,
            onClose: callback
        })
    })
}
const api = {
    open: notice,
    config: function(options) {
        if (options.duration !== undefined) {
            defaultDuration = options.duration
        }
        if (options.getContainer !== undefined) {
            getContainer = options.getContainer
        }
        // delete messageInstance for new configs
        if (options.top !== undefined) {
            defaultTop = options.top
            messageInstance = null
        }
        if (options.maxCount !== undefined) {
            maxCount =  options.maxCount
            messageInstance = null
        }
    },
    destory: function() {
        if (messageInstance) {
            messageInstance.destory()
            messageInstance = null
        }
    }
}

['success', 'error', 'warn'].forEach(item => {
    api[item] = function(content, duration, onClose) {// message.success(content, [duration], onClose)
        if (isArgsProps(content)) {// message.success(args)
            api.open({ ...content, type, onClose })
        }

        if (typeof duration === 'function') {
            onClose = duration
            duration = undefined
        }
        api.open({ content, duration, onClose })
    } 
})


export { api }