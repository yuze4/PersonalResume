const commentForm = document.getElementById('comment-form');
const commentsList = document.getElementById('comments-list');
const feedback = document.getElementById('form-feedback');
const noComments = document.getElementById('no-comments');

async function fetchComments() {
  const response = await fetch('/api/comments');
  if (!response.ok) return;
  const comments = await response.json();
  renderComments(comments);
}

function renderComments(comments) {
  commentsList.innerHTML = '';
  if (!comments.length) {
    noComments.style.display = 'block';
    return;
  }
  noComments.style.display = 'none';

  comments
    .slice()
    .reverse()
    .forEach((comment) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'comment-item';

      const meta = document.createElement('div');
      meta.className = 'comment-item__meta';
      const name = document.createElement('span');
      name.textContent = comment.name || 'Anonymous';
      const time = document.createElement('time');
      time.dateTime = comment.timestamp;
      time.textContent = new Date(comment.timestamp).toLocaleString();
      meta.appendChild(name);
      meta.appendChild(time);

      const message = document.createElement('p');
      message.className = 'comment-item__message';
      message.textContent = comment.message;

      wrapper.appendChild(meta);
      wrapper.appendChild(message);
      commentsList.appendChild(wrapper);
    });
}

commentForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  feedback.textContent = '';

  const formData = new FormData(commentForm);
  const payload = {
    name: formData.get('name'),
    message: formData.get('message'),
  };

  const response = await fetch('/api/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    commentForm.reset();
    feedback.textContent = 'Comment posted!';
    renderComments([...(await fetch('/api/comments').then((r) => r.json()))]);
  } else {
    const error = await response.json();
    feedback.textContent = error.error || 'Something went wrong.';
  }
});

fetchComments();
