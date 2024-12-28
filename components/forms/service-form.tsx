import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMarketplace } from "@/hooks/use-marketplace";

export function ServiceForm() {
  const [category, setCategory] = useState<string>("");
  const { user } = useAuth();
  const {
    createNewService,
  } = useMarketplace();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      await createNewService({
        user_id: user.id,
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        skillcoinPrice: Number(formData.get("price")),
        deliveryTime: Number(formData.get("delivery_time")), 
        category,
        requirements: formData.get("requirements")?.toString(),
      });
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" required />
      </div>

      <div>
        <Label htmlFor="price">Price (SkillCoins)</Label>
        <Input id="price" name="price" type="number" min="0" required />
      </div>

      <div>
        <Label htmlFor="delivery_time">Delivery Time (days)</Label>
        <Input
          id="delivery_time"
          name="delivery_time"
          type="number"
          min="1"
          required
        />
      </div>
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <Filter className="w-4 h-4 mr-2" />
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="technology">Technology</SelectItem>
          <SelectItem value="design">Design</SelectItem>
          <SelectItem value="writing">Writing</SelectItem>
          <SelectItem value="marketing">Marketing</SelectItem>
          <SelectItem value="business">Business</SelectItem>
        </SelectContent>
      </Select>
      <div>
        <Label htmlFor="requirements">Requirements</Label>
        <Textarea id="requirements" name="requirements" />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Service"}
      </Button>
    </form>
  );
}
