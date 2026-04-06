import { useParams, Navigate } from "react-router-dom";

const GerenciarTEC = () => {
  const { tecId } = useParams();
  return <Navigate to={`/emissao-tec/${tecId}`} replace />;
};

export default GerenciarTEC;
