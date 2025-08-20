import Navigation from './Navigation/Navigation'
import NavigationMobile from './Navigation/NavigationMobile'
import UserControls from './UserControls/UserControls'

function HeaderBelow({ session }) {
    return (
        <div className="flex justify-between items-center border-t border-gray-200 py-4 px-4">
            <div className="hidden flex-1 lg:flex items-center justify-start">{/* <Logo /> */}</div>
            <div className="hidden lg:flex flex-1 justify-center">
                <Navigation />
            </div>

            <div className="flex lg:hidden flex-1 justify-center">
                <NavigationMobile />
            </div>

            <div className="flex flex-1 items-center justify-end space-x-3">
                <UserControls session={session} />
            </div>
        </div>
    )
}

export default HeaderBelow
