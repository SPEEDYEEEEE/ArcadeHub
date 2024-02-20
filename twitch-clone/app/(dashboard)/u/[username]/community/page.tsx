import {format } from "date-fns";

import { getBlockedUsers } from "@/lib/blocked-service";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

const CommunityPage = async () => {
    try {
      const blockedUsers = await getBlockedUsers();
  
      if (!Array.isArray(blockedUsers)) {
        throw new Error("Error fetching blocked users");
      }
  
      const formattedData = blockedUsers.map((block) => ({
        ...block,
        userId: block.blocked.id,
        imageUrl: block.blocked.imageUrl,
        username: block.blocked.username,
        createdAt: format(new Date(block.blocked.createdAt), "dd/MM/yyyy"),
      }));
  
      return ( 
        <div className="p-6">
          <div className="mb-4">
            <h1 className="text-2xl font-bold">
              Community Settings
            </h1>
          </div>
          <DataTable columns={columns} data={formattedData} />
        </div>
      );
    } catch (error) {
      console.error("Error:", error);
      return (
        <div className="p-6">
          <p>Error fetching blocked users. Please try again later.</p>
        </div>
      );
    }
  }
   
  export default CommunityPage;
  