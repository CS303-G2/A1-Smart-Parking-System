import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Background from "./Background";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import api from "../api.js";
import { getUserInfo } from "../store/index.js";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatTimestamp = (timestamp) => {
    const dateTime = new Date(timestamp);

    // Format date as YYYY-MM-DD
    const date = dateTime.toISOString().split("T")[0];

    // Format time as HH:mm:ss
    const time = dateTime.toTimeString().split(" ")[0];

    // Combine date and time
    return `${date} ${time}`;
  };

  useEffect(() => {
    async function fetchBookings() {
      try {
        const token = localStorage.getItem("jwt_token");

        const response = await getUserInfo(token);
        const data = response.bookings;

        // Transform response into rows
        const transformedData = Object.keys(data).map((key, index) => ({
          id: index + 1, // Assign a unique ID
          lotId: data[index][0],
          timeStamp: formatTimestamp(data[index][1]), // Format the timestamp
        }));

        setBookings(transformedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setLoading(false);
      }
    }

    fetchBookings();
  }, []);

  const handleRemoveBooking = async (lotId) => {
    try {
      const token = localStorage.getItem("jwt_token");
      const response = await api.post(
        "/lotRelease",
        { lot_id: lotId },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Authorization header
          },
        }
      );
      if (response.status === 200) {
        setBookings((prev) =>
          prev.filter((booking) => booking.lotId !== lotId)
        );
        alert("Booking successfully removed!");
      } else {
        alert("Failed to remove booking: " + response.data.message);
      }
    } catch (error) {
      console.error("Error removing booking:", error);
      alert("An error occurred while removing the booking.");
    }
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "lotId", headerName: "Lot ID", flex: 2 },
    { field: "timeStamp", headerName: "Timestamp", flex: 3 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          onClick={() => handleRemoveBooking(params.row.lotId)}
        >
          Remove
        </Button>
      ),
    },
  ];

  return (
    <div className="h-screen pt-24 mx-12">
      <Navbar />
      <Background brightness={0.9} opacity={0.6} />
      <div className="p-4">
        <Paper sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={bookings}
            columns={columns}
            loading={loading}
            pageSizeOptions={[5, 10]}
            sx={{
              border: 0,
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f5f5f5",
              },
            }}
          />
        </Paper>
      </div>
    </div>
  );
}

export default Bookings;
