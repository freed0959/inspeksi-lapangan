import { execSync } from 'child_process';

console.log('Pulling latest changes from GitHub...');

try {
  // Fetch latest changes
  execSync('git fetch origin master', { cwd: '/vercel/share/v0-project', stdio: 'inherit' });
  console.log('✓ Fetched latest changes from remote');

  // Pull changes
  execSync('git pull origin master', { cwd: '/vercel/share/v0-project', stdio: 'inherit' });
  console.log('✓ Successfully pulled latest changes from master branch');

  // Show git status
  const status = execSync('git status', { cwd: '/vercel/share/v0-project', encoding: 'utf-8' });
  console.log('\nCurrent Git Status:');
  console.log(status);

} catch (error) {
  console.error('Error pulling changes:', error.message);
  process.exit(1);
}
