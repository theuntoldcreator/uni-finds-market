import { useState } from 'react';
import { Upload, X, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface CreateListingProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (listing: any) => void;
}

const categories = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'books', label: 'Books & Study' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'vehicles', label: 'Vehicles' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'gaming', label: 'Gaming' },
];

const locations = [
  'Delhi University North Campus',
  'Delhi University South Campus',
  'JNU Campus',
  'Jamia Millia Islamia',
  'IIT Delhi',
  'AIIMS Delhi',
  'Other - Specify in description'
];

export function CreateListing({ isOpen, onClose, onSubmit }: CreateListingProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    location: '',
    contact: '',
    images: [] as File[]
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = (files: FileList) => {
    const newImages = Array.from(files).slice(0, 5 - formData.images.length);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast({ title: "Error", description: "Please enter a title", variant: "destructive" });
      return false;
    }
    if (!formData.price) {
      toast({ title: "Error", description: "Please enter a price", variant: "destructive" });
      return false;
    }
    if (!formData.category) {
      toast({ title: "Error", description: "Please select a category", variant: "destructive" });
      return false;
    }
    if (!formData.location) {
      toast({ title: "Error", description: "Please select a location", variant: "destructive" });
      return false;
    }
    if (!formData.contact.trim()) {
      toast({ title: "Error", description: "Please enter a contact number", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setShowConfirmation(true);
  };

  const confirmSubmit = async () => {
    setIsUploading(true);
    
    try {
      // Simulate image upload to Cloudinary
      const imageUrls = await Promise.all(
        formData.images.map(async (file) => {
          // In real implementation, upload to Cloudinary here
          return URL.createObjectURL(file);
        })
      );

      const listing = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        price: parseInt(formData.price),
        category: formData.category,
        location: formData.location,
        contact: formData.contact,
        images: imageUrls,
        seller: {
          name: 'Current User', // Get from Clerk user
          avatar: ''
        },
        timeAgo: 'just now',
        isFavorited: false
      };

      onSubmit(listing);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        category: '',
        location: '',
        contact: '',
        images: []
      });
      
      setShowConfirmation(false);
      onClose();
      
      toast({
        title: "Success!",
        description: "Your listing has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create listing. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Create New Listing</DialogTitle>
            <DialogDescription>
              Fill in the details below to create your marketplace listing
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-3">
              <Label>Images (Max 5)</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload images or drag and drop
                  </p>
                </label>
              </div>
              
              {formData.images.length > 0 && (
                <div className="grid grid-cols-5 gap-2">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Listing Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., iPhone 13 Pro Max in excellent condition"
                className="bg-background/50"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your item in detail..."
                rows={4}
                className="bg-background/50"
              />
            </div>

            {/* Price and Category */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="0"
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location and Contact */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Location *</Label>
                <Select value={formData.location} onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="contact"
                    value={formData.contact}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                    placeholder="+91 9876543210"
                    className="pl-10 bg-background/50"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-gradient-primary hover:opacity-90">
              Create Listing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Listing</DialogTitle>
            <DialogDescription>
              Please review your listing details before publishing
            </DialogDescription>
          </DialogHeader>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{formData.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Price:</strong> ₹{parseInt(formData.price || '0').toLocaleString()}</p>
              <p><strong>Category:</strong> {categories.find(c => c.value === formData.category)?.label}</p>
              <p><strong>Location:</strong> {formData.location}</p>
              <p><strong>Contact:</strong> {formData.contact}</p>
              {formData.description && <p><strong>Description:</strong> {formData.description}</p>}
              <p><strong>Images:</strong> {formData.images.length} uploaded</p>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Edit
            </Button>
            <Button 
              onClick={confirmSubmit} 
              disabled={isUploading}
              className="bg-gradient-primary hover:opacity-90"
            >
              {isUploading ? 'Publishing...' : 'Publish Listing'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}