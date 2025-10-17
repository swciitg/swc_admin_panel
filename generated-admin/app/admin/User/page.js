'use client';
import { useState, useEffect } from 'react';
import TableView from '@/components/TableView';
export default function UserAdminPage(){
    const [data,setData]= useState([]);
    const [error,setError] = useState(null);
    const fetchData = async()=>{
        try{
            const res = await fetch('/api/admin/User');
            if(!res.ok) throw new Error(`Status: ${res.status} | Error occured during data fetching`)
            const result = await res.json();
            setData(result.data|| []);
            setError(null);
        }
        catch(error){
            setError(error.message);
            console.error("Error in fetching module User",error)
        }
    }
    useEffect(()=>{
        fetchData();
    },[])

     if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h2>Error loading User data</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }
   return (
    <div>
      <div style={{ padding: '20px', borderBottom: '1px solid #ddd' }}>
        <h1>User Management</h1>
        <p>Total records: {data.length}</p>
      </div>
      <TableView data={data} />
    </div>
  );
}