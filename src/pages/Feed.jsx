import LinkedInFeed from '../components/LinkedInFeed'
import Sidebar from '../components/Sidebar'

const Feed = () => {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
      <div className="space-y-6">
        <LinkedInFeed />
      </div>
      <Sidebar />
    </div>
  )
}

export default Feed
