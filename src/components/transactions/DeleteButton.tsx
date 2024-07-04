import { Button } from "@/components/ui/button";
import { DeleteTransaction } from "@/actions";
import { Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  id: string;
}
export const Delete = ({ id }: Props) => {
  const { toast } = useToast();
  return (
    <Button
      variant={"destructive"}
      size={"sm"}
      onClick={async () => {
        const confirmed = window.confirm(`¿Desea eliminar el movimiento?`);
        if (confirmed) {
          const res = await DeleteTransaction({ id });
          if (res.ok) {
            toast({
              title: "¡Éxitoso!",
              description: res.message,
              variant: "success",
            });
          } else {
            toast({
              title: "¡Alerta!",
              description: res.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "¡Éxitoso!",
            description: "El proceso de eliminación fue cancelado",
          });
        }
      }}
    >
      <Trash size={18} />
    </Button>
  );
};
