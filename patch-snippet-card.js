const fs = require('fs');
const file = 'components/snippet-card.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add Edit/Trash to lucide-react import
content = content.replace("import { Copy, Check, Heart } from 'lucide-react';", "import { Copy, Check, Heart, Edit, Trash2 } from 'lucide-react';");
content = content.replace("import Link from 'next/link';", ""); // in case it exists
content = "import Link from 'next/link';\n" + content;

// 2. Add delete handler to the component
const deleteHandler = `
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (isDeleting || !currentUser || currentUser.id !== snippet.user_id) return;

    if (window.confirm('Are you sure you want to delete this snippet? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        const { error } = await supabase.from('snippets').delete().eq('id', snippet.id);
        if (error) throw error;
        router.refresh();
      } catch (err) {
        console.error('Failed to delete snippet:', err);
        alert('Failed to delete snippet. Please try again.');
        setIsDeleting(false);
      }
    }
  };
`;

content = content.replace("const handleCopy = () => {", deleteHandler + "\n  const handleCopy = () => {");

// 3. Add edit and delete buttons next to the heart button if user is owner
const actionButtons = `
          <div className="flex items-center gap-1">
            {currentUser && currentUser.id === snippet.user_id && (
              <>
                <Link
                  href={\`/snippets/\${snippet.id}/edit\`}
                  className="p-2 rounded-xl transition-all hover:bg-neutral-800 text-neutral-500 hover:text-white"
                  title="Edit snippet"
                >
                  <Edit className="w-5 h-5" />
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className={\`p-2 rounded-xl transition-all hover:bg-neutral-800 text-neutral-500 hover:text-red-500 \${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}\`}
                  title="Delete snippet"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </>
            )}
            <button
              onClick={handleFavorite}
`;

content = content.replace(/<button\s+onClick=\{handleFavorite\}/s, actionButtons);

// Add closing tag for the div
content = content.replace(/title=\{\!currentUser \? "Login to favorite" \: localFavorited \? "Remove from favorites" \: "Add to favorites"\}\n\s+>\n\s+<Heart className=\{`w-5 h-5 \$\{localFavorited \? 'fill-red-500 text-red-500' \: 'text-neutral-500'\}`\} \/>\n\s+<\/button>/, `title={!currentUser ? "Login to favorite" : localFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={\`w-5 h-5 \${localFavorited ? 'fill-red-500 text-red-500' : 'text-neutral-500'}\`} />
            </button>
          </div>`);

fs.writeFileSync(file, content);
