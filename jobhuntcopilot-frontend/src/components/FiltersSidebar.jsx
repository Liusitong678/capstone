// src/components/FiltersSidebar.jsx
import { Accordion, Form } from "react-bootstrap";

export default function FiltersSidebar({ state, setState }) {
  const onCheck = (key) => (e) => setState(prev => ({ ...prev, [key]: e.target.checked }));

  return (
    <div className="rb-filters">
      <div className="rb-filters-title">Filters</div>
      <Accordion defaultActiveKey="0" flush>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Working schedule</Accordion.Header>
          <Accordion.Body>
            <Form.Check label="Full time" checked={!!state.fulltime} onChange={onCheck("fulltime")} />
            <Form.Check label="Part time" checked={!!state.parttime} onChange={onCheck("parttime")} />
            <Form.Check label="Internship" checked={!!state.intern} onChange={onCheck("intern")} />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Employment type</Accordion.Header>
          <Accordion.Body>
            <Form.Check label="Flexible schedule" checked={!!state.flex} onChange={onCheck("flex")} />
            <Form.Check label="Shift work" checked={!!state.shift} onChange={onCheck("shift")} />
            <Form.Check label="Remote" checked={!!state.remote} onChange={onCheck("remote")} />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}
