import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useGetAdminUsers, useUpdateUser, adminKeys } from "@/Api/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const DEFAULT_PASSWORD = "password123456";

const UsersTable = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string } | null>(null);

  const updateUser = useUpdateUser();

  const { data, isLoading } = useGetAdminUsers({
    page,
    limit: 10,
    search: search || undefined,
    role: (selectedRole as "customer" | "office-boy") || undefined,
  });

  const handleResetClick = (userId: string, userName: string) => {
    setSelectedUser({ id: userId, name: userName });
    setResetDialogOpen(true);
  };

  const handleConfirmReset = async () => {
    if (!selectedUser) return;

    try {
      await updateUser.mutateAsync({
        id: selectedUser.id,
        password: DEFAULT_PASSWORD,
      });
      queryClient.invalidateQueries({ queryKey: adminKeys.getUsers });
      setResetDialogOpen(false);
      setSelectedUser(null);
    } catch {
      // Error handled in fetcher
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4 flex-wrap items-end">
        <div className="flex items-center gap-2">
          <span className="text-sm">Search:</span>
          <Input
            type="text"
            placeholder="Name, email, cabin..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-48"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">Role:</span>
          <Select
            value={selectedRole}
            onValueChange={(value) => {
              setSelectedRole(value === "all" ? "" : value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
              <SelectItem value="office-boy">Office Boy</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {(search || selectedRole) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearch("");
              setSelectedRole("");
              setPage(1);
            }}
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-2">Name</th>
              <th className="text-left py-2 px-2">Email</th>
              <th className="text-left py-2 px-2">Role</th>
              <th className="text-left py-2 px-2">Cabin</th>
              <th className="text-left py-2 px-2">Status</th>
              <th className="text-left py-2 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.users && data.users.length > 0 ? (
              data.users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-background/50">
                  <td className="py-2 px-2">{user.name}</td>
                  <td className="py-2 px-2">{user.email}</td>
                  <td className="py-2 px-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        user.role === "customer"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-2 px-2">{user.cabinNumber || "-"}</td>
                  <td className="py-2 px-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        user.isCheckedIn
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.isCheckedIn ? "Checked In" : "Checked Out"}
                    </span>
                  </td>
                  <td className="py-2 px-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResetClick(user._id, user.name)}
                      disabled={updateUser.isPending}
                    >
                      Reset Password
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted-foreground">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data?.pagination && data.pagination.pages > 1 && (
        <div className="flex justify-between items-center pt-4">
          <span className="text-sm text-muted-foreground">
            Page {data.pagination.page} of {data.pagination.pages} ({data.pagination.total} users)
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= data.pagination.pages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Reset Password Confirmation Dialog */}
      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Password</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reset the password for <strong>{selectedUser?.name}</strong>?
              <br />
              <br />
              The new password will be: <code className="bg-muted px-2 py-1 rounded">{DEFAULT_PASSWORD}</code>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmReset}
              disabled={updateUser.isPending}
            >
              {updateUser.isPending ? "Resetting..." : "Reset Password"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UsersTable;
