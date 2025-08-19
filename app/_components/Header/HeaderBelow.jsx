import Navigation from './Navigation/Navigation'
import NavigationMobile from './Navigation/NavigationMobile'
import UserControls from './UserControls/UserControls'

function HeaderBelow({ session }) {
    return (
        <div className="flex justify-between items-center border-t border-gray-200 py-4 px-4">
            <div className="hidden lg:flex flex-1 justify-center">
                <Navigation />
            </div>

            <div className="flex lg:hidden flex-1 justify-center">
                <NavigationMobile />
            </div>

            <div className="flex items-center space-x-4">
                <UserControls session={session} />
            </div>
        </div>
    )
}

export default HeaderBelow
