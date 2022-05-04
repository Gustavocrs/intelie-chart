import './btnDefault.css'

export default function Button(props){
  return <button className="btnDefault" onClick={props.onClick}>{props.name}</button>
}