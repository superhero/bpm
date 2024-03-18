function flashMessage(message)
{
  const content = dom.new('div')

  content.addClass('flash-message')
  content.setContent(message)

  dom.select('main').append(content)

  setTimeout(() => content.setCss('opacity', 1),  100)
  setTimeout(() => content.setCss('opacity', 0), 1100)
  setTimeout(() => content.remove(),             2100)
}