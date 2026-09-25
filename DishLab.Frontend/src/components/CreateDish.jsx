import { useState } from 'react';
import { useDishes } from '../hooks/useDishes';

export default function CreateDish({ onDishCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const { addDish } = useDishes();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (title.length < 3 || title.length > 100) {
      setFormError('Titeln måste vara mellan 3 och 100 tecken lång.');
      return;
    }

    setIsSubmitting(true);

    const result = await addDish({
      title,
      description,
    });

    setIsSubmitting(false);

    if (result.success) {
      setTitle('');
      setDescription('');
      if (onDishCreated) {
        onDishCreated();
      }
    } else {
      setFormError(result.message);
    }
  };

  return (
    <div>
      <h3>Skapa ny rätt</h3>
      {formError && <p style={{ color: 'red' }}>{formError}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Titel på rätten:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            minLength={3}
            maxLength={100}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Beskrivning:</label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sparar...' : 'Skapa rätt'}
        </button>
      </form>
    </div>
  );
}