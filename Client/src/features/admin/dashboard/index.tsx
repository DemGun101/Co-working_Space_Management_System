import type { User } from "@/Api/auth";
import Header from "@/components/header";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddUserDialog from "./components/add-user-dialog";
import HistoryTable from "./components/history-table";
import UsersTable from "./components/users-table";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);

  const user: User = JSON.parse(localStorage.getItem("userData") || "{}");

  const handleLogout = () => {
    queryClient.clear();
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} onLogout={handleLogout} />
      <div className="max-w-4xl w-full mx-auto px-4 mt-6">
        <Tabs defaultValue="history" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
            </TabsList>
            <Button
              variant="outline"
              onClick={() => setAddUserDialogOpen(true)}
              className="cursor-pointer"
            >
              Add User
            </Button>
          </div>

          <TabsContent value="history">
            <div className="bg-muted rounded-md p-4">
              <h2 className="font-semibold mb-3">History</h2>
              <HistoryTable />
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div className="bg-muted rounded-md p-4">
              <h2 className="font-semibold mb-3">User Management</h2>
              <UsersTable />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <AddUserDialog
        open={addUserDialogOpen}
        onOpenChange={setAddUserDialogOpen}
      />
    </div>
  );
};

export default AdminDashboard;
