function notification(title, message)
{
  const
    overlay       = dom.new('div'),
    notification  = dom.new('div'),
    head_title    = dom.new('h2'),
    wrapper       = dom.new('div'),
    content       = dom.new('div'),
    close         = dom.new('span')

  wrapper.addClass('content-wrapper')
  content.addClass('content')
  overlay.addClass('overlay')
  notification.addClass('notification')
  close.addClass('close')
  close.addClass('material-symbols-outlined')
  close.setContent('close')
  head_title.setContent(title)
  content.setContent(message)
  wrapper.append(head_title)
  wrapper.append(content)

  notification.append(close)
  notification.append(wrapper)
  dom.select('main').append(overlay).append(notification)

  close.on('click', () =>
  {
    overlay.remove()
    notification.remove()
  })
}