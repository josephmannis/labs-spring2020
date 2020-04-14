import React from 'react';
import styled from '../../theme/Theme';
import { NavigationLink } from '../atoms/Typography';
import devices from '../../styles/breakpoints';
import burger from '../../images/global/burger.svg'
import { lunchboxColors } from '../../theme/lunchbox';
import closebutton from '../../images/global/closebutton.svg';
import { searchPageRoute, homePageRoute, helpPageRoute } from '../../var/routes';

interface IHeaderProps {

}

const HeaderContainer = styled.nav`
    position: fixed;
    top: 0;
    z-index: 999;
    width: 100%;
`

const HeaderLink = styled(NavigationLink)`
    text-transform: uppercase;
    margin: 2em 3em 2em 1em;
    

    @media ${devices.tablet} {
        margin: 2em 0;
    }
`
// TODO: there's a bug where if you go to a link from mobile and then re-expand to desktop is doens't reappear
// TODO: ImageButton
const Burger = styled.img`
    display: none;
    position: absolute;
    right: 2em;
    top: 2em;
    height: 2em;
    transition: all .1s ease-in-out;

    &:hover {
        transform: scale(1.2);
    }

    @media ${devices.tablet} {
        display: flex;
    }
`

const HeaderMenu = styled.div`

    @media ${devices.desktop} {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
    }

    @media ${devices.tablet} {
        position: absolute;
        text-align: left;
        width: auto;
        top: 2em;
        right: 2em;
        display: none;
        flex-direction: column;
        padding: 1em 2em;
        background-color: ${lunchboxColors.gusher};
        color: white;
        z-index: 999;
        box-shadow: 0 0 10px ${lunchboxColors.gusher};
    }
`

const CloseButton = styled.img`
    display: none;
    position: absolute;
    right: 1.5em;
    top: 1.5em;
    height: 8%;
    transition: all .2s ease-in-out;

    &:hover {
        transform: scale(1.1);
    }

    @media ${devices.tablet} {
        display: flex;
    }
`

export class Header extends React.Component<IHeaderProps> {
    private menu = React.createRef<HTMLDivElement>();

    constructor(props: IHeaderProps) {
        super(props);
        this.toggleMenu.bind(this);   
    }

    // TODO: This is hacky I think but idk how to do it otherwise
    toggleMenu() {
        const node = this.menu.current;
        if (node) {
            const display = node?.style.display;

            if (display === 'none' || !display) {
                node.style.display = 'flex';
            } else {
                node.style.display = 'none';
            }
        }
    }

    render() {
        return (
            <HeaderContainer>
                    <HeaderMenu ref={this.menu}>
                    <CloseButton onClick={() => this.toggleMenu()} src={closebutton}/>
                    <HeaderLink to={homePageRoute}>Home</HeaderLink>
                    <HeaderLink to={searchPageRoute}>Connect With City Hall</HeaderLink>
                    <HeaderLink to={helpPageRoute}>Help</HeaderLink>
                </HeaderMenu>
                <Burger onClick={() => this.toggleMenu()} src={burger}/>
            </HeaderContainer>
        )
    }
}