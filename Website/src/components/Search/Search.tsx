import React, { useEffect, useState } from "react";
import "../Search/Search.css";
import { FaChevronLeft, FaChevronRight, FaEye, FaSearch, FaSyncAlt } from "react-icons/fa";
import { searchImage } from "@/services/media/searchImage";
import { format } from 'date-fns';
import { getListMail } from "@/services/user/getListMail";

type Image = {
  id: number;
  name: string;
  origin_url: string;
  predicted_url: string;
  created_at: string;
};

type Email = {
  email: string;
};

function Search() {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<Image[]>([]);
  const [emailData, setEmailData] = useState<Email[]>([]);
  const [rowsPerPage] = useState(10);
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isModalOpenOrigin, setIsModalOpenOrigin] = useState<boolean>(false);
  const [isModalOpenPredict, setIsModalOpenPredict] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState("");

  const handleImageOriginClick = (imageUrl: any) => {
    setSelectedImage(imageUrl);
    setIsModalOpenOrigin(true);
  };

  const handleImagePredictClick = (imageUrl: any) => {
    setSelectedImage(imageUrl);
    setIsModalOpenPredict(true);
  };

  const handlePageChange = (newPage: any) => {
    if (newPage > 0) {
      setCurrentPage(newPage);
    }
  };

  const fetchData = async (page: any) => {
    try {
      const offset = page;
      const response = await searchImage(offset, rowsPerPage, email, date);
      setData(response);
    } catch (error) {
      console.error("Error fetching history image details:", error);
      throw error;
    }
  }

  const fetDataEmail = async () => {
    try {
      const response = await getListMail();
      console.log(response);
      setEmailData(response);
    } catch (error) {
      console.error("Error fetching mail list", error);
      throw error;
    }
  };

  const handleSearch = async () => {
    try {
      setIsSearching(true);
      const response = await searchImage(currentPage, rowsPerPage, email, date);
      setData(response);
      setIsSearching(false);
    } catch (error) {
      console.error("Error fetching history image details:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  useEffect(() => {
    fetDataEmail();
  }, []);

  return (
    <div>
      <header className="header">
        <div className="search-container">
          <label htmlFor="dropdown">Choose an option email:</label>
          <select id="dropdown" value={email} onChange={(e) => setEmail(e.target.value)}>
            <option value="" disabled>
              -- Select an option --
            </option>
            {emailData.map((mail) => (
              <option key={mail.email} value={mail.email}>
                {mail.email}
              </option>
            ))}
          </select>
          <label htmlFor="dropdown">Choose an option date:</label>
          <input
            type="date"
            className="input-date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button className="btn-search" onClick={handleSearch} style={{
            backgroundColor: isSearching ? '#FF4500' : '#007BFF',
          }} disabled={isSearching}>
            {!isSearching ? <FaSearch style={{ marginRight: '8px' }} /> : <FaSyncAlt style={{ marginRight: '8px' }} size={16} className={isSearching ? 'rotating-icon' : ''} />}
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
      </header>
      {data && (
        <div>
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
                    <a href={`history/image-details/${row.id}`}>
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
}

export default Search;
