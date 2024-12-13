import { useState, useEffect } from "react";
import "../HistoryImageDetail/HistoryImageDetail.css";
import { getHistoryImageDetail } from "@/services/media/getHistoryImageDetail";
import { toast } from "react-toastify";
import { useParams } from 'react-router-dom';

type ImageDetails = {
  id: number;
  secure_url: string;
  gender: number;
  age: number;
};

const HistoryImageDetail = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<ImageDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { image_id } = useParams();

  const fetchData = async (page: any) => {
    setLoading(true);
    setError(null);
    try {
      const offset = page;
      const response = await getHistoryImageDetail(image_id);
      console.log(response);
      setData(response);
    } catch (err) {
      toast.error("Failed to fetch history data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage: any) => {
    if (newPage > 0) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="table-container">
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <>
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Face</th>
                <th>Gender</th>
                <th>Age</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
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
                      onClick={() => setIsModalOpen(true)}
                    >
                    </div>
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
                            src={row.secure_url}
                            alt="Scanned"
                            style={{ width: '100%', height: '100%', display: 'block' }}
                          />
                        </div>
                      </div>
                    )}
                  </td>
                  <td>{row?.gender === 0 ? 'Male' : 'Female'}</td>
                  <td>{row?.age}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default HistoryImageDetail;
