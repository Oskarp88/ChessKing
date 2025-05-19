import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import style from './AlerDismissible.module.css'
function AlertDismissible({title,text, show, setShow, variant}) {

  return (
    <div className={style.modalOverlay}>
      <div className={style.modalAlert}>
        <Alert show={show} variant={variant}>
            <Alert.Heading style={{color: '#550505'}}>{title}</Alert.Heading>
            <p style={{color: '#550505'}}>
            {text}
            </p>
            <hr />
            <div className="d-flex justify-content-end">
            <Button onClick={() => setShow(false)} variant={`outline-${variant}`} style={{color: '#550505'}}>
                Close me
            </Button>
            </div>
        </Alert>
      </div>
    </div>
  );
}

export default AlertDismissible;