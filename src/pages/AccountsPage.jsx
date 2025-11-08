import { useProjects } from "../api/useProjects";
import React, { useEffect, useState } from "react";
import ItemList from "../components/ItemList";
import { useTokenContext } from "../context/TokenContext";

export default function AccountsPage() {
  const token = useTokenContext();
  const { data: accounts } = useProjects(token);
  return (
    <div>
      <ItemList title="Accounts" items={accounts} basePath="accounts" />;
    </div>
  );
}
