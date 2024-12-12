import React, { useState, useEffect } from "react";
import "../History/History.css";
import { fetchHistoryImages } from "@/services/media/getHistoryImageList";
import { toast } from "react-toastify";
import { FaEye, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { format } from 'date-fns';

type Image = {
  id: number;
  name: string;
  origin_url: string;
  predicted_url: string;
  created_at: string;
};

const History = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [data, setData] = useState<Image[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
                            src={row.origin_url}
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
                            src={row.predicted_url}
                            alt="Scanned"
                            style={{ width: '100%', height: '100%', display: 'block' }}
                          />
                        </div>
                      </div>
                    )}
                  </td>
                  <td>{format(new Date(row.created_at), 'yyyy-MM-dd HH:mm')}</td>
                  <td>
                    <a href={`/history/image-details/${row.id}`}>
                      <FaEye />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
