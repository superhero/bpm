/**
 * @memberof Bpm.Schema.Input
 * @typedef {Object} Test
 */
const schema =
{
  pid:
  {
    'type'    : 'string'
  },
  bpmn_xml:
  {
    'type'    : 'string',
    'default' : `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" targetNamespace="" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL http://www.omg.org/spec/BPMN/2.0/20100501/BPMN20.xsd">
  <process id="Process_0f8xzkm" />
  <bpmndi:BPMNDiagram id="sid-74620812-92c4-44e5-949c-aa47393d3830">
    <bpmndi:BPMNPlane id="sid-cdcae759-2af7-4a6d-bd02-53f3352a731d" bpmnElement="Process_0f8xzkm" />
  </bpmndi:BPMNDiagram>
</definitions>`
  }
}

module.exports = schema