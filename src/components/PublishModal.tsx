import React, { useState } from 'react';

interface PublishModalProps {
  onClose: () => void;
  onPublish: (script: any) => void;
}

const PublishModal: React.FC<PublishModalProps> = ({ onClose, onPublish }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [author, setAuthor] = useState('Anonymous');
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [keyProtected, setKeyProtected] = useState(false);
  const [accessKey, setAccessKey] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors(['Please upload an image file (PNG/JPG)']);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(['Image must be less than 5MB']);
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setThumbnail(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateContent = (text: string): boolean => {
    const nsfwKeywords = ['porn', 'gore', 'xxx', 'sex', 'illegal', 'malware', 'virus'];
    const lowerText = text.toLowerCase();
    return !nsfwKeywords.some(keyword => lowerText.includes(keyword));
  };

  const handlePublish = () => {
    const newErrors: string[] = [];

    if (!title.trim()) {
      newErrors.push('Script title is required');
    }
    if (!tags.trim()) {
      newErrors.push('At least one tag is required');
    }
    if (keyProtected && !accessKey.trim()) {
      newErrors.push('Access key is required for protected scripts');
    }
    if (!validateContent(`${title} ${description}`)) {
      newErrors.push('Content contains inappropriate material');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    onPublish({
      title,
      description,
      tags: tags.split(',').map(t => t.trim()).filter(t => t),
      author,
      thumbnail,
      isKeyProtected: keyProtected,
      accessKey: keyProtected ? accessKey : null,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg max-w-md w-full mx-4 max-h-96 overflow-y-auto border border-gray-700">
        <div className="bg-gray-700 px-6 py-4 border-b border-gray-600 flex justify-between items-center sticky top-0">
          <h2 className="text-xl font-bold text-indigo-400">📤 Publish Script</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          {errors.length > 0 && (
            <div className="bg-red-900 border border-red-700 rounded p-3">
              {errors.map((error, i) => (
                <div key={i} className="text-red-200 text-sm">✗ {error}</div>
              ))}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Script Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Awesome Script"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Author
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Your name"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does your script do?"
              rows={2}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Tags * (comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="utility, game, tool"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Thumbnail (PNG/JPG)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full text-sm text-gray-400"
            />
            {thumbnail && (
              <img
                src={thumbnail}
                alt="Preview"
                className="mt-2 rounded w-full h-32 object-cover"
              />
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="keyProtected"
              checked={keyProtected}
              onChange={(e) => setKeyProtected(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="keyProtected" className="text-sm text-gray-300">
              🔐 Protect with access key
            </label>
          </div>

          {keyProtected && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Access Key
              </label>
              <input
                type="password"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                placeholder="Enter access key"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-gray-200 font-medium transition"
            >
              Cancel
            </button>
            <button
              onClick={handlePublish}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-medium transition"
            >
              ✓ Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublishModal;
