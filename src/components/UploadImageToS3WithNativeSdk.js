import React ,{useState} from 'react';
import AWS from 'aws-sdk';
import bg from '../assets/bg.mp4' ;
import './UploadImageToS3WithNativeSdk.css';
import { NavLink } from 'react-router-dom';


const S3_BUCKET ='receipt2s3';
const REGION ='us-east-1';

AWS.config.update({
    accessKeyId: 'AKIAWU7Z6OFZGMVFKVGP',
    secretAccessKey: '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'
});

const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET},
    region: REGION,
});

const UploadImageToS3WithNativeSdk = () => {
  const [fileName, setFileName] = useState('');
  const [hideInput, setHideInput] = useState(false);
  const [hideInput2, setHideInput2] = useState(false);
  const [progress , setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleFileInput = (e) => {
      setSelectedFile(e.target.files[0]);
      setHideInput(true);
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name);

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = () => {
      setImagePreview(reader.result);
    };
  }

  const uploadFile = (file) => {
      const params = {
          ACL: 'public-read',
          Body: file,
          Bucket: S3_BUCKET,
          Key: file.name
      };
      myBucket.putObject(params)
          .on('httpUploadProgress', (evt) => {
              setProgress(Math.round((evt.loaded / evt.total) * 100))
          })
          .send((err) => {
              if (err) console.log(err)
          })
          setHideInput2(true);
          
  }
  let uploadMessage;
  if(progress === 0) {
    if(hideInput === true)
      uploadMessage = '';
    else
      uploadMessage = 'UPLOAD YOUR RECEIPT HERE';
  } else if(progress != 100) {
    uploadMessage = 'File Upload is in Progress: ' + progress + '% ....';
  } else {
    uploadMessage = 'click on view results for output';
  }
  let button;
  if(selectedFile === null) {
      button = <p>SELECT FILE TO UPLOAD</p>;
    } else {
      button = <button id="styleme" onClick={() => uploadFile(selectedFile)}> Upload</button>;
    }
  return <div>
    <div className='main'>
        <div className="overlay"></div>
        <video src={bg} autoPlay loop muted />
        <div className="content">
        {uploadMessage}
        {button}
        {!hideInput && (
        <input type="file" onChange={handleFileInput}/>
        )}
        <div id="image-preview">
        {imagePreview && <img id="image-preview" src={imagePreview} alt="Preview" />}
        </div>
        {hideInput2 && (<NavLink to="/newpage" style={{
        textDecoration: "none",
        color: "white",
        textShadow: '0 2px 2px black',
        backgroundColor: "#000088",
        padding: "10px 20px",
        fontWeight: "bold",
        cursor: "pointer",
        float: "right",
        position: "fixed",
        bottom:10,
        right:200,
      }}>View Result</NavLink>)}
        </div>
    </div>
  </div>
}




export default UploadImageToS3WithNativeSdk;
        