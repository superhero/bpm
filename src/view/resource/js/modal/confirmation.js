function confirmation(title, question, alternatives = { accept:'Accept', reject:'Reject' })
{
  return new Promise((accept) =>
  {
    const
      overlay       = dom.new('div'),
      confirmation  = dom.new('div'),
      head_title    = dom.new('h2'),
      wrapper       = dom.new('div'),
      content       = dom.new('div'),
      form          = dom.new('form')

    wrapper.addClass('content-wrapper')
    content.addClass('content')
    overlay.addClass('overlay')
    confirmation.addClass('confirmation')
    head_title.setContent(title)
    content.setContent(question)
    wrapper.append(head_title)
    wrapper.append(content)
    wrapper.append(form)

    for(const alternative in alternatives)
    {
      const button = dom.new('button')
      button.setContent(alternatives[alternative])
      button.on('click', () =>
      {
        overlay.remove()
        confirmation.remove()
        accept(alternative)
      })
      form.append(button)
    }

    confirmation.append(wrapper)
    dom.select('main').append(overlay).append(confirmation)
  })
}