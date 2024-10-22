import React, { useState, useEffect } from "react";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { link as linkStyles } from "@nextui-org/theme";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import NextLink from "next/link";
import { useTheme } from "next-themes";
import clsx from "clsx";

import { Hourglass, PenSquare, LogIn, Palette } from "lucide-react";

export const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { theme, setTheme } = useTheme();

  const themes = [
    { key: "guardian", name: "Guardian" },
    { key: "going-global", name: "Going Global" },
    { key: "motorsports", name: "Motorsports" },
    { key: "bravery", name: "Bravery" },
    { key: "vida", name: "Vida" },
  ];

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    setIsLoggedIn(!!accessToken);
  }, []);

  const renderAuthButton = () => {
    if (isLoggedIn) {
      return (
        <Button
          as={Link}
          className="text-sm font-normal text-default-600 bg-default-100"
          href="/postgreeting"
          variant="flat"
          startContent={<PenSquare size={18} />}
        >
          Compose Message
        </Button>
      );
    } else {
      return (
        <Button
          as={Link}
          className="text-sm font-normal text-default-600 bg-default-100"
          href="/login"
          variant="flat"
          startContent={<LogIn size={18} />}
        >
          Login
        </Button>
      );
    }
  };

  const renderThemeSwitch = () => (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="light"
          startContent={<Palette size={18} />}
          className="text-sm font-normal"
        >
          Theme
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Theme selection"
        selectedKeys={new Set([theme || ""])}
        onSelectionChange={(keys) => {
          const selected = Array.from(keys)[0]?.toString();
          if (selected) setTheme(selected);
        }}
        selectionMode="single"
      >
        {themes.map((t) => (
          <DropdownItem key={t.key}>{t.name}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );

  return (
    <NextUINavbar
      maxWidth="full"
      position="static"
      className="bg-content1 rounded-full shadow-md"
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Hourglass />
            <p className="font-bold text-inherit">Wheels of Time</p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="center"
      >
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          <NavbarItem>
            <NextLink
              className={clsx(
                linkStyles({ color: "foreground" }),
                "data-[active=true]:text-primary data-[active=true]:font-medium"
              )}
              color="foreground"
              href="/"
            >
              Journey
            </NextLink>
          </NavbarItem>
          <NavbarItem>
            <NextLink
              className={clsx(
                linkStyles({ color: "foreground" }),
                "data-[active=true]:text-primary data-[active=true]:font-medium"
              )}
              color="foreground"
              href="/postgreeting"
            >
              Wall of Celebration
            </NextLink>
          </NavbarItem>
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem>{renderThemeSwitch()}</NavbarItem>
        <NavbarItem>{renderAuthButton()}</NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          <NavbarMenuItem>
            <Link color="foreground" href="/" size="lg">
              Wall of Celebration
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link color="foreground" href="#" size="lg">
              Journey
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link
              color="foreground"
              href={isLoggedIn ? "/postgreeting" : "/login"}
              size="lg"
            >
              {isLoggedIn ? "Compose Message" : "Login"}
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>{renderThemeSwitch()}</NavbarMenuItem>
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
