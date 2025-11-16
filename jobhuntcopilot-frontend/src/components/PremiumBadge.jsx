import React from "react";
import { Badge } from "react-bootstrap";
import { useAuth } from "../firebase/useAuth";

export default function PremiumBadge() {
  const { role } = useAuth();

  const colors = {
    free: "secondary",
    premium: "warning",
    admin: "danger"
  };

  const labels = {
    free: "FREE USER",
    premium: "PREMIUM",
    admin: "ADMIN"
  };

  console.log(role);
  

  return (
    <Badge bg={colors[role]} className="ms-2">
      {labels[role]}
    </Badge>
  );
}
