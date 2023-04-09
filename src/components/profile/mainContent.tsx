import React from "react";
import { Card, CardContent } from "@mui/material";

interface MainContentProps {
  children: React.ReactNode;
}

const MainContent: React.FC<MainContentProps> = ({ children }) => {
  return (
    <Card
      sx={{
        height:'80vh',
        backgroundColor: '#19053B',
        color: '#ffffff',
        border: 1,
        marginLeft: 2,
        marginTop: 2,
      }}
    >
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default MainContent;