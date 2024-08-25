import { useEffect, useState } from 'react'
import './App.css'

/*
  1. array of toasts
      - toast
        - text + cross icon
        - countdown time to be available
        - setTimeout to dismiss (same close icon callback to be executed automatically)
          - data
            - id, text, closeHandler
  2. CTA will add a new toast
      - if count of toasts == 5, remove first toast and then add new one
*/

function ToastNotification() {
  const [toastCount, setToastCount] = useState(0);
  const [toastsArr, setToastsArr] = useState([]);

  const deleteToastHandler = function(id){
    setToastsArr(toastsArr => {
      let toastsCopy = toastsArr.map(toast => {
        if(toast.id === id){
          return {...toast, toRemove: true}
        } 
        else return {...toast}
      })
      return toastsCopy;
    });

    setTimeout(()=>{
      setToastsArr(toastsArr => {
        let toastsCopy = [...toastsArr];
        let targetIndex = toastsCopy.findIndex(el => el.id === id);
        toastsCopy.splice(targetIndex, 1);
        return toastsCopy;
      });
    },300);
    
  }

  const addNewToast = () => {
    if(toastsArr.length >= 10){
      // remove first toast
      let firstToast = toastsArr[0];
      deleteToastHandler(firstToast.id);
    }
    // add new toast
    let toastObj = {
      id: toastCount+1,
      text: `toast id: ${toastCount+1}`,
      closeHandler: deleteToastHandler.bind(this, toastCount+1),
      toRemove: false,
    }
    setToastCount(toastCount => toastCount + 1);
    setToastsArr(toastsArr => [...toastsArr, toastObj]);
  }

  return (
    <div className='w-screen h-screen flex justify-center items-center'>
      <button onClick={addNewToast} className='p-2 border-black border-[1px] rounded-xl bg-orange-200 cursor-pointer'>Add toast</button>
      <div className='absolute top-0 right-0'>
        {
          toastsArr.map(toast => {
            return (
              <Toast key={toast.id} {...toast} />
            )
          })
        }
      </div>
    </div>
  )
}

function Toast({id, text, closeHandler, toRemove}){
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(()=>{
    let timeoutId = setTimeout(closeHandler, 10000);
    let intervalId = setInterval(()=>{
      if(timeLeft > 1){
        setTimeLeft(time => time - 1);
      }
      else clearInterval(intervalId);
    },1000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    }
  }, []);

  return (
    <div className={`w-[200px] flex p-2 border-black border-[1px] bg-amber-100 justify-between rounded-md mt-2 mr-4 ${toRemove ? "exit-animation" : "entry-animation"}`}>
      <span>{text} - {timeLeft} secs</span>
      <span onClick={closeHandler} className='cursor-pointer'>x</span>
      <span className='fixed bottom-0 right-0 h-[4px] bg-orange-400 w-full shrinking-width-animation rounded-md'></span>
    </div>
  )
}

export default ToastNotification;