import React, { useEffect, useState, useRef } from 'react';
import style from './UserProfile.module.css'; // Import the CSS file
import axios from 'axios';
import { useAuth } from '../../Context/authContext';
import { AiOutlinePlus, AiOutlineToTop, AiOutlineUpload } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ReactCrop, { Crop} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';


const UserProfile: React.FC = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [photo, setPhoto] = useState<File | ''>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  // const initialCropState: Crop = { unit: '%', width: 50, height: 50, x: 0, y: 0 };
  // const [crop, setCrop] = useState<Crop>({
  //   unit: '%',
  // width: 50,
  // height: 50,
  // x: 0,
  // y: 0,
  // aspect: 1,
  // });
  
  // const [croppedImage, setCroppedImage] = useState<string>(''); // Estado para almacenar la imagen recortada
  // const imageRef = useRef<HTMLImageElement | null>(null);


  const getUser = async() =>{
    try {
        const {data} = await axios.get(`http://localhost:8080/api/user/${auth.user._id}`);
        setName(data.name);
        setLastName(data.lastName);
        setEmail(data.email);
        setUsername(data.username);
        setCountry(data.country);
      } catch (error) {
      console.log(error);
    }
  }

  // useEffect(() => {
  //   if (imageRef.current && photo) {
  //     imageRef.current.src = URL.createObjectURL(photo);
  //   }
  // }, [photo]);
  
  useEffect(()=>{
    getUser();
},[]);

const handleUploadIconClick = () => {
  setShowModal(true);
};

const handleModalClose = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  event.preventDefault();
  event.stopPropagation(); // Detener la propagación del evento
  setShowModal(false);
  // setCroppedImage(''); // Restablecer la imagen recortada al cerrar el modal

};

const handleEditPhoto = () => {
  if (photo) {
    setShowModal(true);
    // setCrop({ ...crop, aspect: 1 }); 
  }
};

// const handleImageLoaded = (image: HTMLImageElement) => {
//   imageRef.current = image;
// };

// const handleChoosePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
//   const file = e.target.files?.[0];
//   if (file) {
//     setPhoto(file);
//     setShowModal(true);
//   }
// };


// const handleCropComplete = (crop: Crop) => {
//   if (photo) {
//     const image = new Image();
//     image.src = URL.createObjectURL(photo);

//     const canvas = document.createElement('canvas');
//     const ctx = canvas.getContext('2d');

//     if (ctx && crop.width && crop.height) {
//       canvas.width = crop.width;
//       canvas.height = crop.height;

//       ctx.drawImage(
//         image,
//         crop.x,
//         crop.y,
//         crop.width,
//         crop.height,
//         0,
//         0,
//         crop.width,
//         crop.height
//       );

//       // canvas.toBlob((blob) => {
//       //   if (blob) {
//       //     const imageUrl = URL.createObjectURL(blob);
//       //     setCroppedImage(imageUrl);
//       //   }
//       // }, 'image/png');
//       const dataUrl = canvas.toDataURL('image/jpeg');
//         setCroppedImage(dataUrl);
//     }
//   }
// };

  const handleUpdate = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('lastName', lastName);
      formData.append('username', username);
      formData.append('country', country);
      if (photo) {
        formData.append('photo', photo, photo.name); // Agrega el archivo adjunto al FormData
      }
     
      const response = await axios.put(`http://localhost:8080/api/user/update/${auth.user._id}`, formData);
      if(response.data.success){
        toast.success(`${name} is update`,{         
          autoClose: 3000,
          closeButton: (
            <button className={style.closeButton}>X</button>
          ),
          });
       
          navigate('/dashboard/user/profile');
        
      }else{
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log('error', error);
      
      toast.error(String(error),{         
        autoClose: 3000,
        closeButton: (
          <button className={style.closeButton}>X</button>
        ),
        });
    }
  };
  

  return (
    <div className={style.userprofile}>
    <div className={style.column}>
      {photo ? (
        <div className={style.profileimage}>
          <img 
            src={URL.createObjectURL(photo)} 
            alt='product-photo' 
            height={'200px'}
          />
        </div>
      ) : (
        <div className={style.profileimage}>
           {auth.user.photo ? 
            <img
              src={`http://localhost:8080/api/user-photo/${auth.user._id}`}
              alt='user-photo'
              height={'200px'}
            /> : 
            <img
            src={'/assets/icon/user.png'}
            alt='user-photo'
            height={'200px'}
          />
            }
        </div>
      )}
       <div className={style.uploadIcon} onClick={handleUploadIconClick}>
            {
              showModal && (
              <div className={style.modal}>
                <div className={style.modalContent}>
                  <h3>Choose an option</h3>
                  <div className={style.buttonGroup}>
                    <button onClick={handleEditPhoto}>Edit Photo</button>
                    <button 
                        className={style.uploadButton}
                        onClick={() => {
                          // Simular el clic en el input de carga de imágenes
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            setPhoto(file || '');
                            setShowModal(false);
                          };
                          input.click();
                        }}
                    >
                      Choose Photo
                    </button>
                    <button onClick={handleModalClose}>Cancel</button>
                  </div>
                </div>
              </div>
              )
              }
          </div>
        <div className={style.upload}>
          <label className={style.label} onClick={handleUploadIconClick}>
            <img src='/assets/icon/outline.png' alt='icon-outline'/>
          </label>
        </div>
        
      </div>
      <div className={style.column}>
        <div className={style.profiledetails}>
          <div className={style.detailrow}>
            <label htmlFor='name'>Name:</label>
            <input type='text' name='name' value={name}  onChange={(e) => setName(e.target.value)}/>
          </div>
          <div className={style.detailrow}>
            <label htmlFor='lastName'>Last Name:</label>
            <input type='text' name='lastName' value={lastName}  onChange={(e) => setLastName(e.target.value)}/>
          </div>
          <div className={style.detailrow}>
          <label htmlFor='username'>Username:</label>
            <input type='text' name='username' value={username}  onChange={(e) => setUsername(e.target.value)}/>
          </div>
          <div className={style.detailrow}>
            <label htmlFor='email'>Email:</label>
            <input type='email' name='email' value={email} disabled onChange={(e) => setEmail(e.target.value)}/>
          </div>
          <div className={style.detailrow}>
            <label htmlFor='country'>Country:</label>
            <input type='text' name='country' value={country} onChange={(e) => setCountry(e.target.value)}/>
          </div>
        </div>
        <button onClick={handleUpdate}>Actualizar Perfil</button>
      </div>
    </div>
  );
};

export default UserProfile;



