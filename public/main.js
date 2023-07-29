const submitBtn = document.querySelectorAll('.submitButton');
const playerAnswer = document.querySelectorAll('.playerAnswer');

Array.from(submitBtn).forEach((element)=>{
    element.addEventListener('click', checkAnswer)
})

async function checkAnswer(){
    const itemText = this.parentNode.parentNode.childNodes[5].value;
    console.log(itemText)

    try{
        const response = await fetch('checkAnswer', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'poemLine': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}