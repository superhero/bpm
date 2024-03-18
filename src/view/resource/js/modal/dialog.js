function dialog(title, question)
{
  const
    overlay       = dom.new('div'),
    notification  = dom.new('div'),
    head_title    = dom.new('h2'),
    wrapper       = dom.new('div'),
    content       = dom.new('div'),
    form          = dom.new('form'),
    textarea      = dom.new('textarea'),
    submit        = dom.new('button'),
    close         = dom.new('span')

  wrapper.addClass('content-wrapper')
  content.addClass('content')
  overlay.addClass('overlay')
  notification.addClass('dialog')
  close.addClass('close')
  close.addClass('material-symbols-outlined')
  close.setContent('close')
  submit.setContent('<span class="material-symbols-outlined">send</span><br>Submit')
  head_title.setContent(title)
  content.setContent(question)
  wrapper.append(head_title)
  wrapper.append(content)
  wrapper.append(form)
  form.append(textarea)
  form.append(submit)

  notification.append(close)
  notification.append(wrapper)
  dom.select('main').append(overlay).append(notification)

  return new Promise((accept, reject) =>
  {
    close.on('click', () =>
    {
      overlay.remove()
      notification.remove()
      reject('cancelled')
    })

    form.on('submit', (event) =>
    {
      event.preventDefault()
      overlay.remove()
      notification.remove()
      accept(textarea.getValue())
    })
  })
}