import { title } from "process"

interface MyComponentTest {
  title: string,
  subtitle: string
}


let variableBool: boolean = true

let saludo: string = ""

export default function MyCompont({title, subtitle}: MyComponentTest ){

  
  if(!variableBool){
    return "falso";
  }


  if(saludo){
    return "verdadero"
  }


  if(!saludo){
    return "false"
  }
  return ( 
    <>
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
    </>
  )
} 