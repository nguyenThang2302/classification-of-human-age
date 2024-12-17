import React, { useState, useEffect } from "react";
import "../History/History.css";
import { fetchHistoryImages } from "@/services/media/getHistoryImageList";
import { toast } from "react-toastify";
import { FaEye, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { format } from 'date-fns';
import { useNavigate } from "react-router-dom";
import { getHistoryImageDetail } from "@/services/media/getHistoryImageDetail";
import { IoCloseCircle } from "react-icons/io5";

type Image = {
  id: number;
  name: string;
  origin_url: string;
  predicted_url: string;
  created_at: string;
};

type ImageDetails = {
  id: number;
  secure_url: string;
  gender: number;
  age: number;
};

const History = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [data, setData] = useState<Image[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpenOrigin, setIsModalOpenOrigin] = useState<boolean>(false);
  const [isModalOpenPredict, setIsModalOpenPredict] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataImageDetails, setDataImageDetails] = useState<ImageDetails[]>([]);
  const [selectedImage, setSelectedImage] = useState("");
  const navigate = useNavigate();

  const handleImageOriginClick = (imageUrl: any) => {
    setSelectedImage(imageUrl);
    setIsModalOpenOrigin(true);
  };

  const handleImagePredictClick = (imageUrl: any) => {
    setSelectedImage(imageUrl);
    setIsModalOpenPredict(true);
  };

  const openModal = async (imageId: any) => {
    try {
      setIsModalOpen(true);
      const response = await getHistoryImageDetail(imageId);
      setDataImageDetails(response);
    } catch (error) {
      console.error("Error fetching image details:", error);
      throw error;
    }
  };

  const fetchData = async (page: any) => {
    setLoading(true);
    setError(null);
    try {
      const offset = page;
      const response = await fetchHistoryImages(offset, rowsPerPage);
      setData(response);
    } catch (err) {
      toast.error("Failed to fetch history data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const redirectToImageDetailsPage = (id: any) => {
    navigate(`/history/image-details/${id}`);
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage: any) => {
    if (newPage > 0) {
      setCurrentPage(newPage);
    }
  };

  const closeModal = () => {
    setDataImageDetails([]);
    setIsModalOpen(false);
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
                <th>Name</th>
                <th>Origin Image</th>
                <th>Predict Image</th>
                <th>Created At</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id}>
                  <td>#{row.id}</td>
                  <td>{row.name}</td>
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
                        backgroundImage: `url(${row.origin_url})`,
                        cursor: 'pointer',
                      }}
                      onClick={() => handleImageOriginClick(row.origin_url)}
                    >
                    </div>
                    {isModalOpenOrigin && (
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
                        onClick={() => setIsModalOpenOrigin(false)}
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
                            src={selectedImage}
                            alt="Scanned"
                            style={{ width: '100%', height: '100%', display: 'block' }}
                          />
                        </div>
                      </div>
                    )}
                  </td>
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
                        backgroundImage: `url(${row.predicted_url})`,
                        cursor: 'pointer',
                      }}
                      onClick={() => handleImagePredictClick(row.predicted_url)}
                    >
                    </div>
                    {isModalOpenPredict && (
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
                        onClick={() => setIsModalOpenPredict(false)}
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
                            src={selectedImage}
                            alt="Scanned"
                            style={{ width: '100%', height: '100%', display: 'block' }}
                          />
                        </div>
                      </div>
                    )}
                  </td>
                  <td>{format(new Date(row.created_at), 'yyyy-MM-dd HH:mm')}</td>
                  <td>
                    {/* <a href="#" onClick={() => redirectToImageDetailsPage(row.id)}>
                      <FaEye />
                    </a> */}
                    <button className="btn-search" onClick={() => { openModal(row.id) }} style={{ backgroundColor: '#28a745', borderColor: '#28a745' }}>
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {isModalOpen && (
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
                overflow: "hidden",
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <h2>Image details</h2>
                <button className="btn-search" onClick={closeModal} style={{ marginBottom: "10px", backgroundColor: '#dc3545', borderColor: '#dc3545' }}>
                  <IoCloseCircle style={{ marginRight: '8px' }} />
                  Close
                </button>
              </div>
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
                        <p>{row.age}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FaChevronLeft />
            </button>
            <span>Page {currentPage}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={data.length < rowsPerPage}
            >
              <FaChevronRight />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default History;
