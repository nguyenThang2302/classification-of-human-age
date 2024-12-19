import { useEffect, useState } from 'react';
import '../Trash/Trash.css'
import { FaSearch, FaSyncAlt, FaTrashRestore } from 'react-icons/fa';
import { getImageTrash } from '@/services/admin/getImageTrash';
import { restoreImageDetail } from '@/services/admin/restoreImageDetail';
import { toast } from 'react-toastify';

type ImageDetails = {
  id: number;
  image_id: number;
  secure_url: string;
  gender: number;
  age: number;
};

function Trash() {
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [search, setSearch] = useState({ value: '', error: '' });
  const [dataImageDetails, setDataImageDetails] = useState<ImageDetails[]>([]);

  useEffect(() => {
    const fetchImageTrash = async () => {
      try {
        const response = await getImageTrash(search.value);
        setDataImageDetails(response);
      } catch (error) {
        console.error("Error fetching image trash:", error);
      }
    };
    fetchImageTrash();
  }, [search.value]);

  const handleRestoreImage = async (imageDetailId: number) => {
    try {
      const response = await restoreImageDetail(imageDetailId);
      if (response.data.message === 'Success') {
        toast.success("Restore image successfully!");
        const response = await getImageTrash(search.value);
        setDataImageDetails(response);
      }
    } catch (error) {
      console.error("Error restoring image:", error);
    }
  };

  return (
    <div>
      <header className="header">
        <div className="search-container">
          <input
            type="text"
            style={{ width: '20%' }}
            value={search.value}
            onChange={(e) => setSearch({ value: e.target.value, error: '' })}
            placeholder="Enter image name"
          />
          {search.error && (
            <span className="error-message">
              {search.error}
            </span>
          )}
          <button className="btn-search" style={{
            backgroundColor: isSearching ? '#FF4500' : '#007BFF',
          }} disabled={isSearching}>
            {!isSearching ? <FaSearch style={{ marginRight: '8px' }} /> : <FaSyncAlt style={{ marginRight: '8px' }} size={16} className={isSearching ? 'rotating-icon' : ''} />}
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
      </header>
      <table className="custom-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Face</th>
            <th>Gender</th>
            <th>Age</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {dataImageDetails.map((row) => (
            <tr key={row.id}>
              <td>#{row.id}</td>
              <td>
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    border: '2px solid #007BFF',
                    borderRadius: '10px',
                    margin: '20px auto 0',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundImage: `url(${row.secure_url})`,
                    cursor: 'pointer',
                  }}
                >
                </div>
              </td>
              <td>
                <p>{(row?.gender === 0 ? 'Male' : 'Female')}</p>
              </td>
              <td>
                <p>{row?.age}</p>
              </td>
              <td>
                <button className="btn-search" onClick={() => handleRestoreImage(row?.id)} style={{ marginBottom: "10px", backgroundColor: '#28a745', borderColor: '#28a745' }}>
                  <FaTrashRestore style={{ marginRight: '8px' }} />
                  Restore
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
  )
}

export default Trash;
