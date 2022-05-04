import "./TextArea.css"

export default function TextArea(props) {
  return (
    <textarea
      className="inputData"
      name="inputData"
      id="inputData"
      cols="30"
      rows="8"
      placeholder="Enter the data here."
      value={props.value}
      onChange={props.onChange}
    ></textarea>
  );
}
