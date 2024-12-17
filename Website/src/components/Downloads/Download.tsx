import { getFoldersAge } from "@/services/media/getFoldersAge";
import { useState } from "react";
import { FaFilter, FaSyncAlt, FaFolder, FaImage, FaDownload } from "react-icons/fa";
import { toast } from "react-toastify";
import '../Downloads/Download.css';
import { IoCloseCircle } from "react-icons/io5";
import { getImagesFilterByAge } from "@/services/media/getImagesFilterByAge";
import { getImagesFilterByGender } from "@/services/media/getImagesFilterByGender";
import { saveAs } from 'file-saver';

type AgeFolder = {
  age: number;
};

type GenderFolder = {
  gender: string;
};

type ImageFile = {
  id: string;
  secure_url: string;
};


function Download() {
  const [isFiltering, setIsFiltering] = useState<boolean>(false);
  const [filterOption, setFilterOption] = useState<string>('');
  const [ageFolders, setAgeFolders] = useState<AgeFolder[]>([]);
  const [genderFolders, setGenderFolders] = useState<GenderFolder[]>([]);
  const [ageImages, setAgeImages] = useState<ImageFile[]>([]);
  const [genderImages, setGenderImages] = useState<ImageFile[]>([]);
  const [isShowImagesFolderAge, setShowImagesFolderAge] = useState<boolean>(false);
  const [isShowImagesFolderGender, setShowImagesFolderGender] = useState<boolean>(false);

  const handleDownloadImage = async (image: ImageFile) => {
    try {
      if ('showDirectoryPicker' in window) {
        const folderHandle = await window.showDirectoryPicker();
        const fileName = `${image['secure_url'].split('/').pop().split('.')[0]}.jpg`;
        const fileHandle = await folderHandle.getFileHandle(fileName, { create: true });
        const fileStream = await fileHandle.createWritable();
        const imageBlob = await fetch(image.secure_url).then(res => res.blob());
        await fileStream.write(imageBlob);
        await fileStream.close();
        toast.success('Images downloaded successfully');
      } else {
        saveAs(image.secure_url, `${image['secure_url'].split('/').pop().split('.')[0]}.jpg`);
        toast.success('Images downloaded successfully');
      }
    } catch (error) {
      toast.error('Error downloading image');
    }
  };

  const handleDownloadFolder = async (folder: AgeFolder | GenderFolder) => {
    try {
      if ('showDirectoryPicker' in window) {
        const folderHandle = await window.showDirectoryPicker();

        if (folder.age) {
          const response = await getImagesFilterByAge(folder.age);
          for (const image of response) {
            const fileName = `${image['secure_url'].split('/').pop().split('.')[0]}.jpg`;
            const fileHandle = await folderHandle.getFileHandle(fileName, { create: true });

            const fileStream = await fileHandle.createWritable();
            const imageBlob = await fetch(image.secure_url).then(res => res.blob());
            await fileStream.write(imageBlob);
            await fileStream.close();
          }
          toast.success('Images downloaded successfully');
        } else if (folder.gender) {
          const gender = folder.gender === 'male' ? 0 : 1;
          const response = await getImagesFilterByGender(gender);
          for (const image of response) {
            const fileName = `${image['secure_url'].split('/').pop().split('.')[0]}.jpg`;
            const fileHandle = await folderHandle.getFileHandle(fileName, { create: true });

            const fileStream = await fileHandle.createWritable();
            const imageBlob = await fetch(image.secure_url).then(res => res.blob());
            await fileStream.write(imageBlob);
            await fileStream.close();
          }
          toast.success('Images downloaded successfully');
        }
      } else {
        if (folder.age) {
          const response = await getImagesFilterByAge(folder.age);
          response.forEach(async (image) => {
            saveAs(image.secure_url, `${image['secure_url'].split('/').pop().split('.')[0]}.jpg`);
          });
          toast.success('Images downloaded successfully');
        } else if (folder.gender) {
          const gender = folder.gender === 'male' ? 0 : 1;
          const response = await getImagesFilterByGender(gender);
          response.forEach(async (image) => {
            saveAs(image.secure_url, `${image['secure_url'].split('/').pop().split('.')[0]}.jpg`);
          });
          toast.success('Images downloaded successfully');
        }
      }
    } catch (error) {
      toast.error('Error downloading images');
    }
  };

  const handleFilter = async () => {
    setAgeFolders([]);
    setGenderFolders([]);
    setIsFiltering(true);
    if (filterOption === '') {
      setIsFiltering(false);
      toast.error('Please select an option to filter');
      return;
    }
    try {
      if (filterOption === 'age') {
        const folders = await getFoldersAge();
        setAgeFolders(folders);
        setIsFiltering(false);
      } else {
        const folders = [
          {
            gender: 'male'
          },
          {
            gender: 'famale'
          }
        ];
        setGenderFolders(folders);
        setIsFiltering(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleMoveToFolderAge = async (folder: AgeFolder) => {
    try {
      setShowImagesFolderAge(true);
      const images = await getImagesFilterByAge(folder.age);
      setAgeImages(images);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMoveToFolderGender = async (folder: GenderFolder) => {
    try {
      const gender = folder.gender === 'male' ? 0 : 1;
      setShowImagesFolderGender(true);
      const images = await getImagesFilterByGender(gender);
      setGenderImages(images);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseImagesFolder = () => {
    setAgeImages([]);
    setGenderImages([]);
    setShowImagesFolderAge(false);
    setShowImagesFolderGender(false);
  };

  return (
    <div>
      <header className="header">
        <div className="search-container">
          <label htmlFor="dropdown">Choose an option filters:</label>
          <select id="dropdown" value={filterOption} onChange={(e) => setFilterOption(e.target.value)}>
            <option value="" disabled>
              -- Select an option --
            </option>
            <option key="age" value="age">
              Age
            </option>
            <option key="gender" value="gender">
              Gender
            </option>
          </select>
          <button className="btn-search" onClick={handleFilter} style={{
            backgroundColor: isFiltering ? '#FF4500' : '#007BFF',
          }} disabled={isFiltering}>
            {!isFiltering ? <FaFilter style={{ marginRight: '8px' }} /> : <FaSyncAlt style={{ marginRight: '8px' }} size={16} className={isFiltering ? 'rotating-icon' : ''} />}
            {isFiltering ? 'Filtering...' : 'Filter'}
          </button>
        </div>
      </header>
      {ageFolders && (
        <div>
          <table className="custom-table">
            <tbody>
              {ageFolders.map((folder) => (
                <tr key={folder.age}>
                  <td style={{ textAlign: 'start', paddingLeft: '30px', position: 'relative' }}>
                    <a href="" onClick={(event) => {
                      event.preventDefault();
                      handleMoveToFolderAge(folder);
                    }}><FaFolder style={{ marginRight: '20px' }} /></a>
                    {folder.age}
                    <a href="" onClick={(event) => {
                      event.preventDefault();
                      handleDownloadFolder(folder);
                    }}><FaDownload style={{ marginRight: '20px', float: 'right' }} /></a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {isShowImagesFolderAge && (
            <div
              style={{
                height: "80%",
                width: "80%",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "#fff",
                padding: "20px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                zIndex: 10,
                overflow: 'hidden',
                overflowY: 'auto'
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "end",
                }}
              >
                <button className="btn-search" onClick={handleCloseImagesFolder} style={{ marginBottom: "10px", backgroundColor: '#dc3545', borderColor: '#dc3545', justifyItems: 'end' }}>
                  <IoCloseCircle style={{ marginRight: '8px' }} />
                  Close
                </button>
              </div>
              <table className="custom-table">
                <tbody>
                  {ageImages.map((image) => (
                    <tr key={image.id}>
                      <td style={{ textAlign: 'start', paddingLeft: '30px', position: 'relative' }}>
                        <a href="" onClick={(event) => {
                          event.preventDefault();
                        }}><FaImage style={{ marginRight: '20px' }} /></a>
                        {`${image['secure_url'].split('/').pop().split('.')[0]}.jpg`}
                        <a href="" onClick={(event) => {
                          event.preventDefault();
                          handleDownloadImage(image);
                        }}><FaDownload style={{ marginRight: '20px', float: 'right' }} /></a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      {
        genderFolders && (
          <div>
            <table className="custom-table">
              <tbody>
                {genderFolders.map((folder) => (
                  <tr key={folder.gender}>
                    <td style={{ textAlign: 'start', paddingLeft: '30px', position: 'relative' }}>
                      <a href="" onClick={(event) => {
                        event.preventDefault();
                        handleMoveToFolderGender(folder);
                      }}><FaFolder style={{ marginRight: '20px' }} /></a>
                      {folder.gender}
                      <a href="" onClick={(event) => {
                        event.preventDefault();
                        handleDownloadFolder(folder);
                      }}><FaDownload style={{ marginRight: '20px', float: 'right' }} /></a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {isShowImagesFolderGender && (
              <div
                style={{
                  height: "80%",
                  width: "80%",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "#fff",
                  padding: "20px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  zIndex: 10,
                  overflow: 'hidden',
                  overflowY: 'auto'
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "end",
                  }}
                >
                  <button className="btn-search" onClick={handleCloseImagesFolder} style={{ marginBottom: "10px", backgroundColor: '#dc3545', borderColor: '#dc3545', justifyItems: 'end' }}>
                    <IoCloseCircle style={{ marginRight: '8px' }} />
                    Close
                  </button>
                </div>
                <table className="custom-table">
                  <tbody>
                    {genderImages.map((image) => (
                      <tr key={image.id}>
                        <td style={{ textAlign: 'start', paddingLeft: '30px' }}>
                          <a href="" onClick={(event) => {
                            event.preventDefault();
                          }}><FaImage style={{ marginRight: '20px' }} /></a>
                          {`${image['secure_url'].split('/').pop().split('.')[0]}.jpg`}
                          <a href="" onClick={(event) => {
                            event.preventDefault();
                            handleDownloadImage(image);
                          }}><FaDownload style={{ marginRight: '20px', float: 'right' }} /></a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )
      }
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
    </div >
  );
}

export default Download;
