
//css
import "./Input.css"










export default function Input({ type, text, refVar, enterCallBack }) {








    // functions sf
    function inputOnFocus(e) {

        e.target.parentNode.classList.add("underLineColor")
        // console.log(e.target.parentNode.firstElementChild.children)
        let spanElements = e.target.parentNode.firstElementChild.children;
        Array.from(spanElements).forEach((element, index) => {
            setTimeout(() => {
                element.classList.add("floatAnimationApply")
                element.classList.remove("floatAnimationApplyReverse")
            }, 100 * index);
        });

    }

    function inputOnBlur(e) {

        if (e.target.value != "") return
        e.target.parentNode.classList.remove("underLineColor")
        let spanElements = e.target.parentNode.firstElementChild.children;
        Array.from(spanElements).forEach((element, index) => {
            setTimeout(() => {
                // element.classList.remove("floatAnimationApply")
                element.classList.add("floatAnimationApplyReverse")
            }, 100 * index);
        });

    }

    function passToogleBtnFunc() {


        let element = refVar.current;

        if (element.type == "password") {
            element.type = "text";
            element.parentNode.children[2].firstElementChild.classList.remove("fa-eye-slash")
        } else {
            element.type = "password";
            element.parentNode.children[2].firstElementChild.classList.add("fa-eye-slash")
        }
    }



    function captureEnter(e) {
        if (!enterCallBack) return
        if (e.key == 'Enter') enterCallBack()
    }















    return (
        <label className='inputField'>
            <p>{text.split("").map((e, index) => <span key={index}>{e}</span>)}</p>

            <input
                type={type}
                onBlur={inputOnBlur}
                onFocus={inputOnFocus}
                onKeyDown={captureEnter}
                ref={refVar} />

            {type == "password" && <button
                onClick={passToogleBtnFunc}
                style={{ "display": type == "password" ? "block" : "none" }}
                className="passShowBtn">
                <i className="fa fa-eye fa-eye-slash"></i>
            </button>}


        </label>
    )
}