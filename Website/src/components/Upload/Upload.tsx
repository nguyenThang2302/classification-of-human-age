/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { FaSyncAlt, FaImage } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Uploads = () => {
  const [image, setImage] = useState<string | null>(null);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleConvert = () => {
    if (!image) {
      toast.warning('Please upload an image first!');
      return;
    }

    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScannedImage(image);
      toast.success('Image scanned successfully!');
    }, 3000);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      {/* Upload Frame */}
      <div
        style={{
          width: '300px',
          height: '300px',
          border: '2px dashed #ccc',
          borderRadius: '10px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: image ? `url(${image})` : undefined,
          position: 'relative',
          overflow: 'hidden',
        }}
        onClick={() => document.getElementById('imageInput')?.click()}
      >
        {!image && (
          <div style={{ textAlign: 'center', color: '#777' }}>
            <FaImage size={50} />
            <p>Click to upload image</p>
          </div>
        )}
        {isScanning && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.5)',
              animation: 'scanEffect 3s linear infinite',
              zIndex: 2,
            }}
          />
        )}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          gap: '10px',
        }}
      >
        <button
          onClick={handleConvert}
          style={{
            padding: '8px 16px',
            backgroundColor: isScanning ? '#FF4500' : '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '15px',
          }}
          disabled={isScanning}
        >
          <FaSyncAlt size={16} className={isScanning ? 'rotating-icon' : ''} />
          {isScanning ? 'Scanning...' : 'Convert'}
        </button>
      </div>
      <input
        type="file"
        id="imageInput"
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleImageChange}
      />

      {/* Scanned Image Frame */}
      {scannedImage && (
        <div
          style={{
            width: '300px',
            height: '300px',
            border: '2px solid #007BFF',
            borderRadius: '10px',
            margin: '20px auto 0',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundImage: `url(${scannedImage})`,
            cursor: 'pointer',
          }}
          onClick={() => setIsModalOpen(true)}
        >
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              position: 'relative',
              width: '80%',
              maxWidth: '500px',
              background: '#fff',
              borderRadius: '10px',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={scannedImage}
              alt="Scanned"
              style={{ width: '100%', display: 'block' }}
            />
          </div>
        </div>
      )}

      <style>
        {`
          .rotating-icon {
            animation: rotate 1s linear infinite;
          }

          @keyframes rotate {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }

          @keyframes scanEffect {
            0% {
              background: rgba(0, 255, 0, 0.3);
              opacity: 0.5;
            }
            50% {
              background: rgba(255, 255, 0, 0.5);
              opacity: 0.7;
            }
            100% {
              background: rgba(0, 0, 255, 0.3);
              opacity: 0.5;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Uploads;
