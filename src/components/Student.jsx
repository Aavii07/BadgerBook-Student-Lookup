
const Student = (props) => {
    return <div>
        <h2>{props.name.first} {props.name.last}</h2>
        <p>{ <strong> {props.major} </strong> }</p>
            <p> {props.name.first} is taking {props.numCredits} credits and
            {props.fromWisconsin ? ' is' : ' is NOT'} from Wisconsin.</p>
            <p>Their interests include:</p>
            <ul>
                {props.interests.map(interest=> (
                    <li key={interest}>{interest}</li> // key asssuming that each interest is unique per person
                ))}
            </ul>
    </div>
}

export default Student;